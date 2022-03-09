package codegym.repository;

import codegym.model.Product;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface IProductRepository extends PagingAndSortingRepository<Product, Long> {
    Iterable<Product> findALlByNameContaining(String name);

    Iterable<Product> findAllByCategory_Id(Long id);

    void deleteAllByCategory_Id(Long id);
}
